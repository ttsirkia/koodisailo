import type { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { FormattedRelativeTime, useIntl } from "react-intl";

import { AlertDialog } from "../components/AlertDialog";
import { AttachmentIcon } from "../components/AttachmentIcon";
import { BinaryFileIcon } from "../components/BinaryFileIcon";
import { SessionContext } from "../components/context/SessionContext";
import { ErrorPanel } from "../components/ErrorPanel";
import { FileDrop } from "../components/FileDrop";
import { Spinner } from "../components/Spinner";
import { TextFileIcon } from "../components/TextFileIcon";
import { getTypedFormattedString, TypedFormattedMessage } from "../utils/translation";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const session = useContext(SessionContext);
  const intl = useIntl();

  if (session?.userName) {
    const itemsQuery = trpc.useQuery(["items.getAll"], { refetchInterval: 1000 * 60 * 5, refetchOnWindowFocus: true });
    const deleteMutation = trpc.useMutation("items.delete");
    const queryUtils = trpc.useContext();
    return (
      <div>
        <p className="lead">
          <TypedFormattedMessage id="my-lead" />
        </p>
        {itemsQuery.isLoading && <Spinner />}
        {!itemsQuery.isError && itemsQuery.data && (
          <div>
            {itemsQuery.data.items.length > 0 && (
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <TypedFormattedMessage id="caption" />
                      </th>
                      <th>
                        <TypedFormattedMessage id="created" />
                      </th>
                      <th>
                        <TypedFormattedMessage id="size" />
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsQuery.data.items.map((x) => (
                      <tr key={x.id}>
                        <td>
                          {x.file && <AttachmentIcon />}
                          {x.binary && <BinaryFileIcon />}
                          {x.file && !x.binary && <TextFileIcon />} <Link href={`/items/${x.id}`}>{x.title}</Link>
                          {x.public && (
                            <span className="ms-2 badge text-bg-success">
                              <TypedFormattedMessage id="public" />
                            </span>
                          )}
                        </td>
                        <td>
                          <FormattedRelativeTime
                            style="long"
                            numeric="auto"
                            updateIntervalInSeconds={10}
                            value={Math.floor((x.createdAt - Date.now()) / 1000)}
                          />
                          {x.isExpiringSoon && (
                            <span className="ms-2 badge text-bg-warning">
                              <TypedFormattedMessage id="expires-soon" />
                            </span>
                          )}
                        </td>
                        <td>
                          <span>{(x.size / 1024).toFixed(1) + " " + getTypedFormattedString(intl, "kilobytes")}</span>
                        </td>
                        <td>
                          {" "}
                          <AlertDialog
                            title={getTypedFormattedString(intl, "remove")}
                            text={getTypedFormattedString(intl, "confirm-delete")}
                            onClick={(e) => {
                              deleteMutation.mutate(
                                { id: x.id },
                                {
                                  onSuccess() {
                                    queryUtils.invalidateQueries(["items.getAll"]);

                                    toast.success(getTypedFormattedString(intl, "alert-code-removed"));
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="small">
                  <TypedFormattedMessage
                    id="my-quota"
                    values={{
                      totalSize: (itemsQuery.data.totalSize / 1024).toFixed(1),
                      percentage: Math.ceil((itemsQuery.data.totalSize / 1024 / itemsQuery.data.totalSizeLimit) * 100),
                    }}
                  />{" "}
                  <TypedFormattedMessage
                    id="my-expiration-time"
                    values={{ expirationTime: itemsQuery.data.expireTime }}
                  />
                </p>
              </div>
            )}
            {itemsQuery.data.items.length === 0 && (
              <div className="alert alert-primary my-4">
                <TypedFormattedMessage id="no-items" />
              </div>
            )}
            <hr className="my-5" />
            <FileDrop sizeLimit={itemsQuery.data.totalSizeLimit * 1024} />
          </div>
        )}
        {itemsQuery.isError && <ErrorPanel />}
      </div>
    );
  } else {
    // No user, show the jumbotron

    return (
      <div>
        <div className="p-3 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">
              <TypedFormattedMessage id="title" />
            </h1>
            <p className="col-md-8 fs-4 mt-4">
              <TypedFormattedMessage id="index-jumbotron-description" />
            </p>
          </div>
        </div>
        <p className="mt-5">
          <TypedFormattedMessage id="index-lead" />
        </p>
      </div>
    );
  }
};

export default Home;

