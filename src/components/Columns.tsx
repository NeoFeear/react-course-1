import 'bootstrap/dist/css/bootstrap.min.css';
import { Draggable } from 'react-beautiful-dnd';
import Cards from './Cards';

interface ColumnElement {
    id: string;
    name: string;
}

interface ColumnInterface {
    data: any,
    editTask(id: string, name: string): void,
    removeTask(id: string): void,
    moveTo(id: string, column: string): void
}

const Columns = ({data, editTask, removeTask, moveTo}: ColumnInterface) => {
    return <>
        {data.tasks.map((el: any, index: number) => {
            return (
                <Draggable key={el.id} index={index} draggableId={el.id}>
                    {(provided) => {
                        return (
                            <div ref={provided.innerRef}{...provided.draggableProps} className={"task"}>
                                <span {...provided.dragHandleProps} className={"drag-handle"}>
                                    <Cards el={el} editTask={editTask} removeTask={removeTask} moveTo={moveTo} />
                                </span>
                            </div>
                        )
                    }}
                </Draggable>
            )
        })}
    </>
}

export default Columns;