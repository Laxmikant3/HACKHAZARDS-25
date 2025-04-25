import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";

function useParallax(value, distance) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

function NewsCard({ data }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const y = useParallax(scrollYProgress, 300);
    const { user_id, url, image, news } = data;
    console.log(user_id, url, image, news);

    const {content} = JSON.parse(news);

    const handleClick = () => {
        window.open(url, "_blank");
    };
    
    return (
        <section onClick={handleClick}>
            <div ref={ref}>
                <motion.img src={image} alt={"image"} style={{ y }} />
                <motion.h4 style={{ y }}>{content}</motion.h4>
            </div>
        </section>
    );
}

export default function NewsDisplay({ newsData }) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            {newsData?.map((e) => (
                <NewsCard key={e} data={e} />
            ))}
            <motion.div className="progress" style={{ scaleX }} />
        </>
    );
}
