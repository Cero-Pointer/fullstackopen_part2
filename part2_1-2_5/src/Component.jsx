const Header = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
        </div>
    )
}


const Courses = (props) => {
    const {courses} = props

return (
    <div>
        {courses.map(course => {
        const total = course.parts.reduce(
            (sum, part) => sum + part.exercises,
            0
        )
        return (
            <div key={course.id}>
            <Header name={course.name}/>

            {course.parts.map(part => 
                <div key={part.id}>
                <div>{part.name}: {part.exercises}</div>
                </div>
            )}

            <div>total of {total} exercises</div>
            </div>
        )
        })}
    </div>
)
}

export default Courses