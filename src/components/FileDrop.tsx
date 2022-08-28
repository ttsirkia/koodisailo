import { Base64 } from "js-base64";
import { FC, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { getTypedFormattedString, TypedFormattedMessage } from "../utils/translation";
import { trpc } from "../utils/trpc";

// ************************************************************************************************

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#ccc",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#666",
  outline: "none",
  transition: "border .24s ease-in-out",
  margin: "20px",
} as React.CSSProperties;

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#070",
};

const rejectStyle = {
  borderColor: "#700",
};

function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ************************************************************************************************

export const FileDrop: FC<{ sizeLimit: number }> = (props) => {
  const intl = useIntl();

  const queryUtils = trpc.useContext();

  const createMutation = trpc.useMutation("items.createOrUpdate", {
    onSuccess(data) {
      toast.success(getTypedFormattedString(intl, "alert-code-saved"));
      queryUtils.invalidateQueries(["items.getAll"]);
    },
    onError(error) {
      console.log(error.data);
      if (error.data?.code === "PAYLOAD_TOO_LARGE") {
        toast.error(getTypedFormattedString(intl, "alert-quota-exceeded"));
      } else {
        toast.error(getTypedFormattedString(intl, "alert-save-failed"));
      }
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      const data = await readFileAsync(file);
      createMutation.mutate({
        content: Base64.fromUint8Array(data as Uint8Array),
        title: file.name,
        file: true,
        public: false,
      });
    });
  };

  const onDropRejected = () => {
    toast.error(getTypedFormattedString(intl, "alert-too-big-file"));
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize: props.sizeLimit,
    maxFiles: 5,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p className="my-0">
          <TypedFormattedMessage id="upload-hint" />
        </p>
        <p className="small mt-2 mb-0">
          <TypedFormattedMessage id="upload-will-replace" />
        </p>
      </div>
    </div>
  );
};
