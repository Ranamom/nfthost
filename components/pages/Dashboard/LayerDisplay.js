import React, { useState, useRef } from "react";
import { Card, CardContent, Typography, Button, Switch, Avatar, FormControlLabel } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import style from "../../../styles/LayerDisplay.module.scss"
import ImageDialog from "./ImageDialog";

const LayerDisplay = ({alertRef, layerList, layerIndex, setLayerList}) => {
    const [editable, setEditable] = useState(false);
    const [fileOverState, setFileOverState] = useState(false);
    const imageDialogRef = useRef();

    const onEdit = (e) => {
        setEditable(e.target.checked);
    };

    const onDragLeave = (e) => {
        setFileOverState(false);
    }

    const onDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setFileOverState(true);
    }

    const onDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setFileOverState(false);
        fileHandler(e.dataTransfer.files);
    }

    const onUpload = (e) => {
        fileHandler(e.target.files);
    }

    const fileHandler = (files) => {
        let newImages = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.match(/image.png/)) {
                alertRef.current.handleOpen("error", "Please upload PNG files only", 3000);
                return;
            }
            newImages.push({
                url: URL.createObjectURL(file),
                name: file.name.substring(0, file.name.lastIndexOf('.')),
                value: -1,
                maxValue: -1,
                percentage: -1
            });
        }
        let newLayerList = [...layerList];
        const oldImageList = newLayerList[layerIndex].images;
        newLayerList[layerIndex].images = oldImageList.length == 0 ? newImages : [...oldImageList, ...newImages];
        setLayerList(newLayerList);
    }

    const onDeleteItem = (index) => {
        let newLayerList = [...layerList];
        newLayerList[layerIndex].images.splice(index, 1);
        setLayerList(newLayerList);
    }

    const onClickItem = (index) => {
        imageDialogRef.current.handleOpen(index);
    }

    return (
        <Card className={style.card}>
            <ImageDialog ref={imageDialogRef} onDeleteItem={onDeleteItem}/>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {layerList[layerIndex] && layerList[layerIndex].name} Images
                </Typography>
                <div className={style.layerDisplay}>
                    <div className={style.layerImageContainer}>
                        {layerList[layerIndex] && layerList[layerIndex].images.map((image, idx) => (
                            <Avatar
                                className={style.layerImageItem}
                                variant="rounded"
                                alt="User Image"
                                src={image.url}
                                sx={{ width: 100, height: 100 }}
                                key={idx}
                                onClick={() => onClickItem(idx)}
                            />
                        ))}
                    </div>
                    {!editable && (
                        <Button 
                            className={fileOverState ? style.layerDisplayDropTrue : style.layerDisplayDropFalse} 
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            component="label"
                        >
                            <FileUploadIcon />
                            <span>Drag and drop images here!</span>
                            <span>(image/png, Max size: 10MB)</span>
                            <input type="file" accept="image/png" onChange={onUpload} hidden/>
                        </Button>
                    )}
                </div>
                <div className={style.editContainer}>
                    <Typography variant="body2" component="div" gutterBottom>
                        Note: All images must have the same dimensions.
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editable}
                                onChange={onEdit}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Edit Images"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default LayerDisplay