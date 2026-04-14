import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface VideoState {
  file: File | null;
  filename: string;
  objectUrl: string | null;
}

interface VideoContextType extends VideoState {
  setVideo: (file: File) => void;
  clearVideo: () => void;
  hasVideo: boolean;
}

const VideoContext = createContext<VideoContextType | null>(null);

export const useVideo = () => {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within VideoProvider");
  return ctx;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<VideoState>({
    file: null,
    filename: "",
    objectUrl: null,
  });

  const setVideo = useCallback((file: File) => {
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    setState({
      file,
      filename: file.name,
      objectUrl: URL.createObjectURL(file),
    });
  }, [state.objectUrl]);

  const clearVideo = useCallback(() => {
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    setState({ file: null, filename: "", objectUrl: null });
  }, [state.objectUrl]);

  const value = useMemo(() => ({
    ...state,
    setVideo,
    clearVideo,
    hasVideo: !!state.file,
  }), [state, setVideo, clearVideo]);

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};
