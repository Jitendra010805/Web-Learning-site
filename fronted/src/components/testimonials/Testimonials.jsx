import React from 'react';
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than anywhere else. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Alex Carter",
      position: "Student",
      message:
        "The platform offers excellent content with clear explanations. It really boosted my confidence in learning.",
      image:
        "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "Student",
      message:
        "This is one of the best learning experiences I’ve ever had. Highly recommended for anyone eager to grow!",
      image:
        "https://i.pravatar.cc/150?u=4",
    },
  ];

  return (
    <section className="testimonials fade-up" style={{animationDelay: '1.8s'}}>
      <h2 className="section-title">What Our Students Have to Say</h2>
      <div className="testimonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            <p className="message">{e.message}</p>
            <div className="student-image">
              <img src={e.image} alt={e.name} />
            </div>
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">From {e.name.split(' ')[0]}'s City, USA</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
