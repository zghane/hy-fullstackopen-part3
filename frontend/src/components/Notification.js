const Notification = ({ message, isError}) => {
        if (message === null) {
                return null
        }

        // render the component differently for info / error messages
        const classNames = "notification " + (isError ? "errorNotification" : "infoNotification")
        return (
                <div className={classNames}>
                        {message}
                </div>
        )
}

export default Notification
