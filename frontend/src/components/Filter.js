const Filter = ({filterString, onChange}) => {
        return (
                <div>
                filter shown with <input value={filterString} onChange={onChange}/>
                </div>
        )
}

export default Filter
