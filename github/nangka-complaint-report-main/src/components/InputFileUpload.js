import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const ButtonContainer = styled('div')({
  marginRight: '16px', 
});

export default function InputFileUpload() {
  const [progress, setProgress] = useState(0); // State for progress
  const [fileReady, setFileReady] = useState(false); // State for file readiness

  // Function to handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Assuming file upload takes some time, setting timeout to simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 10; // Increment progress by 10% each time
          } else {
            clearInterval(progressInterval);
            setFileReady(true); // File is ready when progress reaches 100%
            return prevProgress;
          }
        });
      }, 1000); // Simulate progress every second
    }
  };

  return (
    <Container>
      <ButtonContainer>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          {fileReady ? 'Ready to submit' : 'Upload file'}
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
      </ButtonContainer>
      {progress > 0 && (
        <div>
          <Typography variant="body2">{`Progress: ${progress}%`}</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </div>
      )}
    </Container>
  );
}
