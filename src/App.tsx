import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _, { filter } from 'lodash';
import { v4 } from 'uuid';
import Swal from 'sweetalert2';

import Cards from './components/Cards';

const item: any = [
   {
      id: v4(),
      name: 'Learn React'
   },
   {
      id: v4(),
      name: 'Learn TypeScript'
   },
   {
      id: v4(),
      name: 'Acheter des ASICS Gel-Lyte III Afew Koi'
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
         items: [item[2]]
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
      Swal.fire({
         title: 'Ajout d\'un item',
         input: 'text',
         inputValue: text,
         inputPlaceholder: 'Votre futur item',
         showCancelButton: true,
      }).then((result: any) => {
         if (result.value) {
            const newItem = { id: v4(), name: result.value };
            const newState = {...state};
            newState['todo'].items.push(newItem);
            setState(newState);
            setText('');
         }
      })
   }

   const editItem = (id: string, name: string) => {
      console.log("Edited item with id: " + id);

      Swal.fire({
         title: 'Edit item',
         input: 'text',
         inputValue: name,
         confirmButtonText: 'Edit',
         showLoaderOnConfirm: true,
         showCancelButton: true,

         preConfirm: (value: string) => {
            const newState = {...state};
            const newTodoItems = newState['todo'].items.map((item: any) => {
               if (item.id === id) {
                  item.name = value;
               }
               return item;
            });
            newState['todo'].items = newTodoItems;
            setState(newState);
         }
      });
   }

   const removeItem = (id: string) => {
      console.log("Removed item with id: " + id);

      const newState = {...state};
      const newTodoItems = newState['todo'].items.filter((item: any) => item.id !== id);
      newState['todo'].items = newTodoItems;
      setState(newState);
   }

   const addCol = () => {
      Swal.fire({
         title: 'Ajout d\'un colonne',
         input: 'text',
         inputValue: text,
         inputPlaceholder: 'Votre future colonne',
         showCancelButton: true,
      }).then((result: any) => {
         if (result.value) {
            setState({
               ...state,
               [result.value]: {
                  title: result.value,
                  items: []
               }
            });
         }
      })
   }

   const moveTo = (id: string): void => {
      Swal.fire({
         title: 'Move item to',
         input: 'select',
         inputOptions: Object.keys(state),
         inputPlaceholder: 'Votre future colonne',
         showCancelButton: true,
      })
      .then((result: any) => {
         if (result.value) {
            // TODO
         }
      });
   }

   return (
   <div className="App">

      {/* ============= BOUTONS AJOUT ============= */}
      <div>
         <div className="btnAdd">
            <button className="btn btn-primary me-5" onClick={addItem}>Ajouter un item</button>
            <button className="btn btn-primary" onClick={addCol}>Ajouter une colonne</button>
         </div>
      </div>

      {/* ============= DRAG N DROP ============= */}
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
                                             <span {...provided.dragHandleProps} className={"drag-handle"}>
                                                <Cards el={el} editItem={editItem} removeItem={removeItem} moveTo={moveTo} />
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