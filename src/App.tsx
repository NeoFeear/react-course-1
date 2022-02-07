import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _, { filter } from 'lodash';
import { v4 } from 'uuid';
import Swal from 'sweetalert2';

import Cards from './components/Cards';

const tasks: any[] = [
    { id: v4(), name: 'Acheter des Asics Koï pour avoir une meilleure note' },
    { id: v4(), name: 'Learn React' },
    { id: v4(), name: 'Learn TypeScript' },
    { id: v4(), name: 'Learn PHP' },
];

function App() {
    const [text, setText] = useState('');
    const [column, setColumn] = useState({
        "todo": {
            id: "todo",
            title: "To Do",
            tasks: [tasks[0]]
        },
        "inProgress": {
            id: "inProgress",
            title: "In Progress",
            tasks: [tasks[1], tasks[2]]
        },
        "done": {
            id: "done",
            title: "Done",
            tasks: [tasks[3]]
        }
    });

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    const handleDragEnd = ({ destination, source }: any) => {
        console.log({ destination, source, column });

        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const newColumn: any = { ...column };

        if (!destination) {
            console.log('Destination is null');
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            console.log('Destination is the same as source');
            return;
        }

        if (sourceId === destinationId) {
            const tasks = newColumn[sourceId].tasks;
            const reorderedTasks = reorder(tasks, source.index, destination.index);
            newColumn[sourceId].tasks = reorderedTasks;
        } else {
            const task = newColumn[sourceId].tasks[source.index];
            newColumn[sourceId].tasks.splice(source.index, 1);
            newColumn[destinationId].tasks.splice(destination.index, 0, task);
        }

        setColumn(newColumn);
    }

    const addColumn = () => {
        Swal.fire({
            title: 'Ajout d\'un colonne',
            input: 'text',
            inputValue: text,
            inputPlaceholder: 'Votre future colonne',
            showCancelButton: true,
        }).then((result: any) => {
            if (result.value) {
                setColumn({
                    ...column,
                    [result.value]: {
                        title: result.value,
                        tasks: []
                    }
                });
            }
        })
    }

    const addTask = () => {
        Swal.fire({
            title: 'Ajout d\'un task',
            input: 'text',
            inputValue: text,
            inputPlaceholder: 'Votre futur task',
            showCancelButton: true,
        }).then((result: any) => {
            if (result.value) {
                const newTask = { id: v4(), name: result.value };
                const newColumn = { ...column };
                newColumn['todo'].tasks.push(newTask);
                setColumn(newColumn);
                setText('');
            }
        })
    }

    const editTask = (id: string, name: string) => {
        Swal.fire({
            title: 'Édition de la tâche',
            input: 'text',
            inputValue: name,
            inputPlaceholder: name,
            showCancelButton: true,
        }).then((result: any) => {
            if (result.value) {
                const newColumn: Record<string, any> = { ...column };
                for (const key in newColumn) {
                    for (const task of newColumn[key].tasks) {
                        if (task.id === id) {
                            task.name = result.value;
                        }
                    }
                }
                // TODO : RÉSOUDRE -> setColumn(newColumn);
            }
        })
    }

    const removeTask = (id: string) => {
        const newColumn: Record<string, any> = { ...column };
        for (const key in newColumn) {
            for (const task of newColumn[key].tasks) {
                if (task.id === id) {
                    newColumn[key].tasks.splice(newColumn[key].tasks.indexOf(task), 1);
                }
            }
        }
        // TODO : RÉSOUDRE -> setColumn(newColumn);
    }

    const moveTo = (id: string): void => {
        Swal.fire({
            title: 'Move task to',
            input: 'select',
            inputOptions: Object.keys(column),
            inputPlaceholder: 'Votre future colonne',
            showCancelButton: true,
        })
        .then((result: any) => {
            if (result.value) {
                const newColumn: Record<string, any> = { ...column };
                for (const key in newColumn) {
                    for (const task of newColumn[key].tasks) {
                        if (task.id === id) {
                            newColumn[result.value].tasks.push(task);
                            newColumn[key].tasks.splice(newColumn[key].tasks.indexOf(task), 1);
                        }
                    }
                }
                // TODO : RÉSOUDRE -> setColumn(newColumn);
            }
        })
    }

    return (
        <div className="App">

            {/* ============= BOUTONS AJOUT ============= */}
            <div>
                <div className="boutons btnAdd">
                    <button className="btn btn-primary me-5" onClick={addTask}>Ajouter un task</button>
                    <button className="btn btn-primary" onClick={addColumn}>Ajouter une colonne</button>
                </div>
            </div>

            {/* ============= FILTRE ============= */}
            <div>
                <div className="boutons btnFilter">
                    <h3 className='text-decoration-underline text-black'>Filtre :</h3>
                    <select className="form-select" onChange={(e: any) => setColumn(e.target.value)}>
                        <option value="">Tous</option>
                        {/* TODO */}
                    </select>
                </div>
            </div>

            {/* ============= DRAG N DROP ============= */}
            <div id="drop">
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(column, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <h2>{data.title}</h2>

                                <Droppable droppableId={key}>
                                    {(provided) => {
                                        return (
                                            <div ref={provided.innerRef}{...provided.droppableProps} className={"droppable-col"}>
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