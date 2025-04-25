# HACKHAZARDS-25

# **Smart News Flow**

**Smart News Flow** is an innovative platform designed for the **Infinyon Quest**, utilizing **Fluvio's real-time data streaming** capabilities combined with **Groq's fast inference large language models (LLMs)** to deliver an enhance and refine historical and realtime news content from various source(currently only supports NewsAPI).

## **Table of Contents**
- [**Smart News Flow**](#smart-news-flow)
  - [**Table of Contents**](#table-of-contents)
  - [**Installation**](#installation)
    - [**Prerequisites**](#prerequisites)
    - [**Steps**](#steps)
  - [**Usage**](#usage)
    - [**Running the Project**](#running-the-project)
      - [**Start the Server**](#start-the-server)
      - [**Start Fluvio Data Pipeline**](#start-fluvio-data-pipeline)
    - [**Demo**](#demo)
  - [**Features**](#features)
  - [**Configuration**](#configuration)
    - [**Environment Variables**](#environment-variables)
      - [**Server**](#server)
      - [**Client**](#client)
      - [**Fluvio Secret Files**](#fluvio-secret-files)
  - [**Architecture**](#architecture)
    - [**System Overview**](#system-overview)
  - [**Contributing**](#contributing)
    - [**Code Style Guidelines**](#code-style-guidelines)
  - [**License**](#license)
  - [**Acknowledgments**](#acknowledgments)

## **Installation**

### **Prerequisites**

Before getting started, ensure you have the following installed on your machine:

- **Node.js >= 16.x**: A JavaScript runtime required for running the server and client. [Download Node.js](https://nodejs.org/).
- **Rust >= 1.80**: A systems programming language needed for building certain parts of the project. [Install Rust](https://forge.rust-lang.org/infra/other-installation-methods.html).
- **Wasm32-Wasip1**: A WebAssembly target for Rust, required for building WebAssembly modules. 
``` bash
rustup target add wasm32-wasip1
```
- **Groq API Key**: An API key needed to access Groq's LLM services. [Sign up for Groq](https://groq.com).
- **NewsAPI Key**: An API key needed to fetch news data from NewsAPI. [Get an API key](https://newsapi.org).

### **Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Precious-Macaulay/Smart-News-Flow.git
   ```
2. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```
3. **Set up environment variables**:
   - Navigate to both the client and server directories and set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   - Fill in the `.env` file with your API base URL and other necessary variables after starting your server.

4. **Start the application**:
   ```bash
   npm run dev
   ```
   client will be available at  `https://localhost:5173`

## **Usage**

### **Running the Project**

#### **Start the Server**
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```
   - The server will be available at `http://localhost:3000`.

#### **Start Fluvio Data Pipeline**
1. **Configure Fluvio**:
   - Open the `secret.txt` file and update the URLs with your correct server URL. For example, if your server is running on port 3000:
     ```
     DATA_URL=https://localhost:3000/stream
     SINK_DATA_URL=https://localhost:3000/data-sync
     ```

2. **Build and start the Fluvio data pipeline**:
   ```bash
   cd fluvio-pipeline
   chmod +x setup.sh
   ./setup.sh
   ```
   - If successful, start the Fluvio stateful data flow change the variable if yours is different:
   - if Rust and Wasm32-Wasip1 requirement are not satisfied
   for rust run   `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
    for Wasm32-Wasip1 run `rustup target add wasm32-wasip1`
   ```bash
   source ~/.bashrc
   sdf run --ui --ephemeral -e API_BASE_URL=REPLACE_WITH_YOUR_SERVER_URL
   ```



## **Features**
- **Real-time Data Streaming**: Streams news data in real time using Fluvio.
- **AI-Powered Content Refinement**: Uses Groq's LLMs to analyze and refine the news content.
- **Customizable News Sources**: Fetch and process news from various sources using NewsAPI.

## **Configuration**

### **Environment Variables**

#### **Server**
- `GROQ_API_KEY`: API key for Groq's LLMs.
- `NEWS_API_KEY`: API key for NewsAPI.

#### **Client**
- `VITE_API_BASE_URL`: API base URL (e.g., `http://localhost:3000`).
- `VITE_WS_BASE_URL`: WebSocket URL (e.g., `wss://localhost:3000`).

#### **Fluvio Secret Files**

- **`secret.txt`**: Example configuration file for Fluvio.

## **Architecture**

### **System Overview**

The **Smart News Flow** architecture is designed for real-time, scalable news content delivery, efficiently handling multiple users. Here's a breakdown:

- **Frontend Client**: Users enter search queries, which are sent to the server to retrieve refined news content.

- **Server with LLM Agents**: The server processes search prompts using **Groq's LLMs** and **LangChain** to generate keywords and fetch real-time news via **NewsAPI**. The raw data is then streamed to the **Fluvio Data Pipeline** using an HTTP source connector.

- **Fluvio Data Pipeline**: This pipeline ingests, validates, and filters incoming data using a custom Fluvio SmartModule. Valid data is enriched with AI in the **Stateful Data Flow** by checking if a news is relevant to a users query, automatically drops it if not, and refines it, saves it to another topic then it is been streamed back to the server through an outbound HTTP sink connector.

- **WebSocket Connection**: The server uses WebSockets to deliver real-time updates to users. If a user is offline, the server stores the refined data and streams it when they reconnect.

- **Scalability**: Fluvio’s data pipeline ensures the system can scale easily, handling multiple users simultaneously without compromising performance.

This architecture supports real-time, AI-enhanced news delivery, built to scale as the user base grows.

## **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**: Click on the `Fork` button at the top-right corner of this repository.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/Smart-News-Flow.git
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit your changes**:
   ```bash
   git commit -m "Add your commit message"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Submit a pull request**: Go to the original repository and open a pull request.

### **Code Style Guidelines**
- Follow the [ESLint](https://eslint.org/) rules for JavaScript/TypeScript.
- Use [Prettier](https://prettier.io/) for code formatting.

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## **Acknowledgments**

- Thanks to Infinyon for providing the Fluvio platform.
- Special thanks to Groq for their LLMs.
- Gratitude to NewsAPI for providing news data.
