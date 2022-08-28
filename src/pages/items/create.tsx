import clsx from "clsx";
import { Base64 } from "js-base64";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { SessionContext } from "../../components/context/SessionContext";

import { getTypedFormattedString, TypedFormattedMessage } from "../../utils/translation";
import { trpc } from "../../utils/trpc";

type Inputs = {
  title: string;
  content: string;
  public: string;
};

const CreateItem: NextPage = () => {
  const intl = useIntl();
  const session = useContext(SessionContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();
  const createMutation = trpc.useMutation("items.createOrUpdate", {
    onSuccess(data) {
      toast.success(getTypedFormattedString(intl, "alert-code-saved"));
      router.push(`/items/${data.id}`);
    },
    onError(error) {
      if (error.data?.code === "PAYLOAD_TOO_LARGE") {
        toast.error(getTypedFormattedString(intl, "alert-quota-exceeded"));
      } else {
        toast.error(getTypedFormattedString(intl, "alert-save-failed"));
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createMutation.mutate({
      title: data.title,
      content: Base64.encode(data.content),
      file: false,
      public: data.public === "true",
    });
  };

  return (
    <div>
      <h2>
        <TypedFormattedMessage id="create-title" />
      </h2>
      <p>
        <TypedFormattedMessage id="create-lead" />
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            <TypedFormattedMessage id="caption" />
          </label>
          <input autoFocus type="text" className="form-control" id="title" {...register("title")} />
        </div>
        <div className="mb-3">
          <label htmlFor={"content"} className="form-label">
            <TypedFormattedMessage id="content" />
          </label>
          <textarea
            className={clsx("form-control", { "is-invalid": errors.content })}
            id="content"
            {...register("content", { required: true })}
            rows={10}
          ></textarea>
        </div>
        {(session?.role === "teacher" || session?.role === "staff") && (
          <div className="mb-3">
            <div className="col-sm-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="public" value="true" {...register("public")} />
                <label className="form-check-label" htmlFor="public">
                  <TypedFormattedMessage id="public" />
                </label>
              </div>
              <div id="requireSignUpHelp" className="form-text">
                <TypedFormattedMessage id="create-public-help" />
              </div>
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-primary mb-3">
          <TypedFormattedMessage id="save" />
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
