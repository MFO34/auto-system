import React, { useState, useEffect } from 'react';
import './ImageSlider.css';
import photo1 from '../../Resources/photo1.jpg';
import photo2 from '../../Resources/photo2.jpg';
import photo3 from '../../Resources/photo3.jpg';
import photo8 from '../../Resources/photo8.png';

function ImageSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [photo1, photo2, photo3, photo8]; // Car wash images

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 3000); // Run effect only once when component mounts
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div className="image-slider">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === activeIndex ? 'active' : ''}`}
                >
                    <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        style={{ maxWidth: '100%', maxHeight: '450px' }}
                    />
                </div>
            ))}
        </div>
    );
}

export default ImageSlider;
