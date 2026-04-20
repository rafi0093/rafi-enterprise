import React from 'react';
import '../assets/style/ScaleSection.css';
import scaleImage from '../assets/images/scale-team.svg';
import Image1 from '../assets/images/cpu.svg';
import Image2 from '../assets/images/global.svg';
import Image3 from '../assets/images/external-drive.svg';

const ScaleSection = () => {
    const cards = [
        {
            title: "Contract-First Process",
            desc: "Every service is defined via Protobuf, ensuring perfect type safety across your entire software stack seamlessly.",
            icon: Image1
        },
        {
            title: "Event-Driven Choreography",
            desc: "Services communicate asynchronously, reducing coupling and enabling horizontal scaling efficiently and reliably.",
            icon: Image2
        },
        {
            title: "Technology Stack",
            desc: "Built with Clojure for complex business logic and Go for high-performance backends. Each language chosen for its strengths. Clojure for expressiveness, Go for speed and concurrency, ensuring robust, scalable, and efficient solutions.",
            icon: Image3,
            fullWidth: true
        }
    ];

    return (
        <section className="scale-section">
            <div className="naturalheading scale-header">
                <div className="header-top">
                    <span>Service B: AI-Native Software Development</span>
                    <span>AI-Native Infrastructure</span>
                </div>
                <div className="header-divider"></div>

                <div className="header-content">
                    <div className="text-area">
                        <h1>Built for Scale, Designed Innovation</h1>
                        <p>We build full-stack, enterprise-grade solutions using an AI-first approach, meticulously designing software with advanced AI capabilities at its core.</p>
                    </div>
                    <div className="image-area">
                        <img src={scaleImage} alt="Team working" className="scale-img" />
                    </div>
                </div>
            </div>

            <div className="scale-grid">
                {cards.map((card, index) => (
                    <div key={index} className={`scale-card ${card.fullWidth ? 'full-width' : ''}`}>
                        <div className="card-icon-box">
                            <img src={card.icon} alt={card.title} className="card-icon-img" />
                        </div>
                        <div className="naturalheading card-texts">
                            <h3>{card.title}</h3>

                            {/* শুধুমাত্র শেষ কার্ডের জন্য এই কন্ডিশন */}
                            {index === cards.length - 1 ? (
                                <>
                                    {/* ডেস্কটপে এই বড় টেক্সটটি দেখাবে */}
                                    <p className="naturalpara desktop-view-text">{card.desc}</p>

                                    {/* মোবাইলে শুধুমাত্র এই ছোট টেক্সটটি দেখাবে */}
                                    <p className="mobileview">Clojure for expressive logic, Go for fast, scalable backends.</p>
                                </>
                            ) : (
                                /* বাকি সব কার্ডে নরমাল ডেসক্রিপশন দেখাবে */
                                <p>{card.desc}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ScaleSection;