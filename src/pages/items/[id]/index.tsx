import ClipboardJS from "clipboard";
import { Base64 } from "js-base64";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

import { AlertDialog } from "../../../components/AlertDialog";
import { SessionContext } from "../../../components/context/SessionContext";
import { Spinner } from "../../../components/Spinner";
import { getTypedFormattedString, TypedFormattedMessage } from "../../../utils/translation";
import { trpc } from "../../../utils/trpc";

const hljs = require("../../../../lib/highlight.min.js");
if (typeof window !== "undefined") {
  (window as any).hljs = hljs;
  require("highlightjs-line-numbers.js");
}

const ItemView: NextPage = (props) => {
  const router = useRouter();
  const intl = useIntl();
  const queryUtils = trpc.useContext();
  const itemQuery = trpc.useQuery(["items.getItem", { id: router.query.id!.toString(), readOnly: true }], {
    onError: (e) => {
      toast.error(getTypedFormattedString(intl, "alert-code-not-found"));
      router.push("/");
    },
    cacheTime: 0,
  });
  const deleteMutation = trpc.useMutation("items.delete");
  const session = useContext(SessionContext);

  // ************************************************************************************************

  useEffect(() => {
    let opts: any = {
      ignoreUnescapedHTML: true,
    };

    if (itemQuery.data?.language) {
      opts.languages = [itemQuery.data?.language];
    }

    hljs.configure(opts);
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();

    const clipboard = new ClipboardJS("#copy-button", {
      text: function (trigger) {
        return Base64.decode(itemQuery.data?.content || "");
      },
    });

    clipboard.on("success", () => {
      toast.success(getTypedFormattedString(intl, "alert-copied"));
    });

    clipboard.on("error", () => {
      toast.success(getTypedFormattedString(intl, "alert-copy-failed"));
    });

    return () => {
      clipboard.destroy();
    };
  }, [itemQuery.data?.content, itemQuery.data?.language]);

  // ************************************************************************************************
  if (itemQuery.isLoading) {
    return <Spinner />;
  }

  if (itemQuery.data) {
    return (
      <>
        <div>
          <h1>{itemQuery.data.title}</h1>
          {!itemQuery.data.isOwn && <h3 className="my-4">{itemQuery.data.userName}</h3>}
          {session?.courseName !== itemQuery.data.courseName && (
            <h3 className=" mt-2 mb-4">{itemQuery.data.courseName}</h3>
          )}

          {!itemQuery.data.public && itemQuery.data.isOwn && (
            <p>
              <TypedFormattedMessage id="view-lead" />
            </p>
          )}

          {!itemQuery.data.binary && (
            <>
              <button id="copy-button" className="btn btn-primary btn-sm">
                <TypedFormattedMessage id="copy-clipboard" />
              </button>
              {itemQuery.data.file && (
                <a
                  className="btn btn-primary btn-sm ms-2"
                  download={itemQuery.data.title}
                  href={window.URL.createObjectURL(
                    new Blob([Base64.toUint8Array(itemQuery.data.content).buffer], {
                      type: "application/octet-stream",
                    })
                  )}
                >
                  <TypedFormattedMessage id="download" />
                </a>
              )}
            </>
          )}

          {!itemQuery.data.binary && (
            <pre className="my-4">
              <code>{Base64.decode(itemQuery.data.content)}</code>
            </pre>
          )}

          {itemQuery.data.binary && (
            <>
              <div className="my-5">
                <hr />
                <p>
                  <TypedFormattedMessage id="download-text" />
                </p>
                {!itemQuery.data.isOwn && (
                  <div className="alert alert-warning">
                    <TypedFormattedMessage id="binary-warning" />
                  </div>
                )}
                <p>
                  <a
                    className="btn btn-primary"
                    download={itemQuery.data.title}
                    href={window.URL.createObjectURL(
                      new Blob([Base64.toUint8Array(itemQuery.data.content).buffer], {
                        type: "application/octet-stream",
                      })
                    )}
                  >
                    <TypedFormattedMessage id="download" />
                  </a>
                </p>
                <p>
                  <span>
                    <TypedFormattedMessage id="size" />
                    {": "}
                    {(itemQuery.data.size / 1024).toFixed(1) + " " + getTypedFormattedString(intl, "kilobytes")}
                  </span>
                </p>
                <hr />
              </div>
            </>
          )}

          {itemQuery.data.isOwn && (
            <>
              {!itemQuery.data.binary && (
                <Link href={`/items/${router.query.id!.toString()}/edit`}>
                  <a className="btn btn-primary btn-sm me-2">
                    <TypedFormattedMessage id="edit" />
                  </a>
                </Link>
              )}
              <AlertDialog
                title={getTypedFormattedString(intl, "remove")}
                text={getTypedFormattedString(intl, "confirm-delete")}
                onClick={(e) => {
                  deleteMutation.mutate(
                    { id: itemQuery.data.id },
                    {
                      onSuccess() {
                        queryUtils.invalidateQueries(["items.getAll"]);
                        queryUtils.invalidateQueries(["items.getItem", itemQuery.data.id]);
                        toast.success(getTypedFormattedString(intl, "alert-code-removed"));
                        router.push("/");
                      },
                      onError() {
                        toast.error(getTypedFormattedString(intl, "alert-remove-failed"));
                      },
                    }
                  );
                }}
                cancelText={getTypedFormattedString(intl, "cancel")}
                actionText={getTypedFormattedString(intl, "remove")}
                actionStyle="btn-danger"
              >
                <button type="button" className="btn btn-outline-danger btn-sm">
                  <TypedFormattedMessage id="remove" />
                </button>
              </AlertDialog>
            </>
          )}
        </div>
      </>
    );
  }

  return null;
};

export default ItemView;
