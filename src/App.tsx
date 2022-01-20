import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
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
    const [state, setState] = useState({
        "todo": {
            title: "Todo",
            items: [item[0]]
        },
        "inProgress": {
            title: "In Progress",
            items: [item[1]]
        },
        "done": {
            title: "Completed",
            items: []
        }
    });

    const handleDragEnd = ({destination, source}: {destination: number, source: number}) => {
        if (!destination) {
            console.log('destination is null');
            return
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            console.log('destination is same as source');
        }

        const itemCopy = {...state[source.droppableId].items[source.index]};

        setState(prevState => {
            prevState = {...prevState},
            prevState[source.droppableId].items.splice(source.index, 1);
            prevState[destination.droppableId].items.splice(destination.index, 0, itemCopy);
            return prevState;
        });

    }

    return (
        <div className="App">

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
    );
}

export default App;