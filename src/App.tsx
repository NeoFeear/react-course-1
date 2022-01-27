import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _, { filter } from 'lodash';
import { v4 } from 'uuid';

const item = [
    {
        id: v4(),
        name: 'Learn React'
    },
    {
        id: v4(),
        name: 'Learn TypeScript'
    }
]

function App() {
    const [text, setText] = useState('');
    const [column, setColumn] = useState('');
    const [state, setState] = useState({
        "todo": {
            title: "Todo",
            items: [item[0], item[1]]
        },
        "inProgress": {
            title: "In Progress",
            items: []
        },
        "done": {
            title: "Completed",
            items: []
        }
    });

    // TODO: console.log(Object.keys(state));  

    const reorder = (list: any, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return result;
    }

    const handleDragEnd = ({destination, source}: any) => {
        console.log({destination, source, state});

        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const newState: any = {...state};

        if (!destination) {
            console.log('Destination is null');
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
          }
        
        if (sourceId === destinationId) {
            const items = newState[sourceId].items;
            const reorderedItems = reorder(items, source.index, destination.index);
            newState[sourceId].items = reorderedItems;
        } else {
            const item = newState[sourceId].items[source.index];
            newState[sourceId].items.splice(source.index, 1);
            newState[destinationId].items.splice(destination.index, 0, item);
        }

        setState(newState);
    }

    const addItem = () => {
        const newItem = {
            id: v4(),
            name: text
        }
        const newState = {...state};
        newState['todo'].items.push(newItem);
        setState(newState);
        setText('');
    }

    const addCol = () => {
        setState({
            ...state,
            [column]: {
                title: column,
                items: []
            }
        });
    }

    return (
        <div className="App">
            <div>
                <div id="btnAddItem">
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                    <button onClick={addItem}>Ajouter un item</button>
                </div>
            </div>

            <div>
                <div id="btnAddCol">
                    <input type="text" value={column} onChange={(e) => setColumn(e.target.value)} />
                    <button onClick={addCol}>Ajouter une colonne</button>
                </div>
            </div>

            <div id="drop">
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <h2>{data.title}</h2>
                                
                                <Droppable droppableId={key}>
                                    {(provided) => {
                                        return(
                                            <div ref={provided.innerRef}{...provided.droppableProps} className={"droppable-col"}>
                                                {data.items.map((el, index) => {
                                                    return (
                                                        <Draggable key={el.id} index={index} draggableId={el.id}>
                                                            {(provided) => {
                                                                return (
                                                                    <div ref={provided.innerRef}{...provided.draggableProps} className={"item"}>
                                                                        <span {...provided.dragHandleProps} className={"drag-handle"}>DRAG</span>
                                                                        &nbsp;-&nbsp; 
                                                                        {el.name}
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }}
                                </Droppable>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>

        </div>
    );
}

export default App;