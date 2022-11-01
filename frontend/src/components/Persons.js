import DeleteButton from "./DeleteButton"

const Persons = ({personArray, onClickDelete}) => {
        return (
                <ul>
                {personArray.map(person => <li key={person.name}>{person.name} {person.number}<DeleteButton onClickDelete={() => {onClickDelete(person.id)}} /></li>)}
                </ul>
        )
}

export default Persons
