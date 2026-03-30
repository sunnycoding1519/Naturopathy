import "./Course.css";

export default function Course() {

  // 👉 future me yaha aur courses add kar sakta hai
  const courses = [
    {
      id: 1,
      title: "Nadi Chikitsa",
      desc: "Ancient pulse diagnosis technique to understand body imbalance.",
      image: "/images/test.jpg"
    },
    {
      id: 2,
      title: "Shaswat Chikitsa",
      desc: "Traditional natural healing therapy for long-term wellness.",
      image: "/images/swami ji.jpg"
    },
    {
      id: 3,
      title: "Hormonal Balance Therapy",
      desc: "Detoxification and rejuvenation therapy using five primary treatments.",
      image: "/images/hormonal.jpg"
    }
  ];

  return (
    <div className="course-container">

      <h2 className="course-title">Our Courses</h2>

      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">

            <img
              src={course.image}
              alt={course.title}
              className="course-img"
            />

            <div className="course-content">
              <h3>{course.title}</h3>
              <p>{course.desc}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}