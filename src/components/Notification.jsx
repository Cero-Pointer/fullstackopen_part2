const Notification = (props) => {
    if (!props.message) {
        return null
    }
    const message = props.message
    console.log(message)
    if (message.toLowerCase().includes("success")) {
        return (
            <div className="success">
                {message}
            </div>
        )
    }
    return (
        <div className="error">
            {message}
        </div>
    )
}


export default Notification