#!/bin/bash

# Define variables
FLUVIO_INSTALL_SCRIPT="https://hub.infinyon.cloud/install/install.sh"
CONNECTOR_DIR="connectors"
CDK_HUB="cdk hub download"
FLUVIO_HUB="fluvio hub sm download"
FLAG_FILE=".setup_complete"
BASHRC_FILE="$HOME/.bashrc"

# Function to print messages
function print_message {
    echo -e "\n\033[1m$1\033[0m\n"
}

# Function to check and continue on error
function check_continue {
    if [ $? -ne 0 ]; then
        echo "Error encountered. Exiting..."
        exit 1
    fi
}

# Check if setup is already complete
if [ -f "$FLAG_FILE" ]; then
    print_message "Setup already completed. Skipping..."
    exit 0
fi

# Setup Fluvio environment
print_message "Setting up Fluvio environment..."
curl -fsS "$FLUVIO_INSTALL_SCRIPT" | bash
source "${HOME}/.fvm/env" || echo "Failed to source .fvm/env"
source ~/.bashrc
check_continue

# Update PATH in .bashrc
if ! grep -q 'source "${HOME}/.fvm/env"' "$BASHRC_FILE"; then
    echo 'source "${HOME}/.fvm/env"' >> "$BASHRC_FILE"
    source "$BASHRC_FILE"
fi

# Install SDF Beta 1 CLI
print_message "Installing SDF Beta 1 CLI..."
fvm install sdf-beta1.1
check_continue

# Start Fluvio
print_message "Starting Fluvio cluster..."
fluvio cluster start
check_continue

# Download connector and smartmodule packages
print_message "Downloading connector and smartmodule packages..."
if [ ! -d "$CONNECTOR_DIR" ]; then
    echo "Directory $CONNECTOR_DIR does not exist. Exiting..."
    exit 1
fi
cd "$CONNECTOR_DIR" || exit
$CDK_HUB infinyon/http-source@0.3.8
check_continue
$CDK_HUB infinyon/http-sink@0.2.10
check_continue
$FLUVIO_HUB infinyon/regex-filter@0.2.0
check_continue

# Deploy connectors
print_message "Deploying connectors..."
cdk deploy start --ipkg infinyon-http-source-0.3.8.ipkg -c inbound.yaml --secrets secrets.txt
check_continue
cdk deploy start --ipkg infinyon-http-sink-0.2.10.ipkg -c outbound.yaml --secrets secrets.txt
check_continue

# Setup requirements for SDF
print_message "Setting up SDF..."
sdf setup
check_continue

# Mark setup as complete
touch "$FLAG_FILE"

print_message "Data pipeline setup complete and ready to receive data."