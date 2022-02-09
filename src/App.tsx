import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { v4 } from 'uuid';
import Swal from 'sweetalert2';

import Columns from './components/Columns';

function App() {
// ===================== INTERFACES =====================
    interface Task {
        id: string;
        name: string;
    }
    interface Column {
        id: number;
        title: string;
        tasks: Task[];
    }
    interface ColumnState {
        [k: string]: Column;
    }

// ===================== TASKS =====================
    const tasks: Task[] = [
        { id: v4(), name: 'Acheter des Asics Koï pour avoir une meilleure note' },
        { id: v4(), name: 'Learn React' },
        { id: v4(), name: 'Learn TypeScript' },
        { id: v4(), name: 'Learn PHP' },
    ];

    // ===================== STATES =====================
    const [text, setText] = useState('');
    const [column, setColumn] = useState<ColumnState>({
        todo: {
            id: 0,
            title: "To Do",
            tasks: [tasks[0]]
        },
        inProgress: {
            id: 1,
            title: "In Progress",
            tasks: [tasks[1], tasks[2]]
        },
        done: {
            id: 2,
            title: "Done",
            tasks: [tasks[3]]
        }
    });

// ===================== FUNCTIONS =====================
    const reorder = (list: any[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    const handleDragEnd = ({ source, destination }: any) => {
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
                        id: column[Object.keys(column)[Object.keys(column).length - 1]].id + 1,
                        title: result.value,
                        tasks: []
                    }
                });
            }
        })
    }

    const addTask = () => {
        Swal.fire({
            title: 'Ajout d\'une tâche',
            input: 'text',
            inputValue: text,
            inputPlaceholder: 'Votre future tâche',
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
                const newColumn: ColumnState = { ...column };

                for (const key in newColumn) {
                    for (const task of newColumn[key as keyof ColumnState].tasks) {
                        if (task.id === id) {
                            task.name = result.value;
                        }
                    }
                }
                setColumn(newColumn);
            }
        })
    }

    const removeTask = (id: string) => {
        Swal.fire({
            title: 'Suppression de la tâche',
            text: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Non, annuler'
        })
        .then((result: any) => {
            if (result.value) {
                const newColumn: ColumnState = { ...column };

                for (const key in newColumn) {
                    for (const task of newColumn[key as keyof ColumnState].tasks) {
                        if (task.id === id) {
                            newColumn[key as keyof ColumnState].tasks.splice(
                                newColumn[key as keyof ColumnState].tasks.indexOf(task), 1
                            );
                        }
                    }
                }
                setColumn(newColumn);
            }
        })
            
    };

    // TODO
    const moveTo = (id: string): void => {
        Swal.fire({
            title: 'Déplacer vers',
            input: 'select',
            inputOptions: Object.keys(column),
            inputPlaceholder: 'Votre future colonne',
            showCancelButton: true,
        })
        .then((result: any) => {
            if (result.value) {
                const newColumn: ColumnState = { ...column };
                
                for (const key in newColumn) {
                    for (const task of newColumn[key as keyof ColumnState].tasks) {
                        if (task.id === id) {
                            /**
                             * TODO : déplacer dans la bonne colonne
                             * newColumn[result.value as keyof ColumnState].tasks.push(task);
                             */

                            newColumn[key as keyof ColumnState].tasks.splice(
                                newColumn[key as keyof ColumnState].tasks.indexOf(task),
                                1
                            );
                        }
                    }
                }
                setColumn(newColumn);
            }
        })
    }

    // TODO
    const selectFilter = (filter: string) => {
        console.log("Afficher seulement les tâches de la colonne : ", filter);
    }

// ===================== RENDER =====================
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
                    <h3 className='text-decoration-underline'>Filtre :</h3>
                    <select className="form-select" onChange={(e: any) => selectFilter(e.target.value)}>
                        <option value="all">Tous</option>
                        <option value="todo">Todo</option>
                        <option value="inProgress">En cours</option>
                        <option value="done">Terminé</option>
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
                                                <Columns 
                                                    key={key}
                                                    data={data}
                                                    editTask={editTask}
                                                    removeTask={removeTask}
                                                    moveTo={moveTo}
                                                />
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