import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconButton from '@mui/material/IconButton';

const DragImages = ({ images, deleteImageWithConfirm, handleDragEnd }) => {

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-images" direction="horizontal">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="image-list"
                        style={{
                            display: 'flex',
                            gap: '8px', // Gap между изображениями
                            flexWrap: 'wrap',
                            overflowX: 'hidden',
                        }}
                    >
                        {images.map((media, index) => {
                            const src = media.blob_url;

                            return (
                                <Draggable key={src} draggableId={src} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="draggable-image-item"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                position: 'relative',
                                                cursor: 'grab',
                                                borderRadius: '8px',
                                                marginTop: '5px',
                                                maxWidth: '200px',
                                                touchAction: 'pan-y',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {/*<DragIndicatorIcon sx={{ marginRight: '8px' }} />*/}

                                            <img
                                                src={src}
                                                alt="Draggable"
                                                style={{
                                                    maxWidth: '100px',
                                                    maxHeight: '100%',
                                                    borderRadius: '8px',
                                                    transition: 'transform 0.2s ease-out',
                                                }}
                                            />

                                            {/*<IconButton*/}
                                            {/*    onClick={() => deleteImageWithConfirm(index)}*/}
                                            {/*    size="small"*/}
                                            {/*    sx={{*/}
                                            {/*        position: 'absolute',*/}
                                            {/*        top: 5,*/}
                                            {/*        right: 5,*/}
                                            {/*        backgroundColor: 'rgba(255,255,255,0.8)',*/}
                                            {/*        '&:hover': { backgroundColor: 'rgba(255,0,0,0.7)' },*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <DeleteIcon fontSize="small" />*/}
                                            {/*</IconButton>*/}
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragImages;
