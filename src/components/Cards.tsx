import { BiEdit, BiTrash } from "react-icons/bi"
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardElement {
    id: string;
    name: string;
}

interface CardInterface {
    el: CardElement,
    editItem(id: string, name: string): void,
    removeItem(id: string): void,
    moveTo(id: string, column: string): void
}

const Cards = ({el, editItem, removeItem, moveTo}: CardInterface) => {
    return <>
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{el.name}</Card.Title>

                <div className="d-flex justify-content-around">
                    <button className="btn btn-primary" onClick={()=> editItem(el.id, el.name)}>
                        <BiEdit /> Éditer
                    </button>

                    <button className="btn btn-success" onClick={()=> moveTo(el.id, 'inProgress')}>
                        <BiEdit /> Déplacer
                    </button>
                    
                    <button className="btn btn-danger" onClick={()=> removeItem(el.id)}>
                        <BiTrash /> Supprimer
                    </button>
                </div>
            </Card.Body>
        </Card>
    </>
}

export default Cards;