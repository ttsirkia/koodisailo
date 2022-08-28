import clsx from "clsx";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

import { ErrorPanel } from "../components/ErrorPanel";
import { Spinner } from "../components/Spinner";
import { CourseDTO } from "../models/Course";
import { getTypedFormattedString, TypedFormattedMessage } from "../utils/translation";
import { trpc } from "../utils/trpc";
import { Stringified } from "../utils/typeUtils";

const SettingsPage: NextPage = () => {
  const intl = useIntl();
  const router = useRouter();
  const queryUtils = trpc.useContext();

  const settingsQuery = trpc.useQuery(["settings.getCourseSettings"], {
    onError: (error) => {
      if (error.data?.code === "FORBIDDEN" || error.data?.code === "UNAUTHORIZED") {
        toast.error(getTypedFormattedString(intl, "alert-no-teacher"));
        router.push("/");
      }
    },
  });
  const settingsMutation = trpc.useMutation(["settings.saveSettings"]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Stringified<CourseDTO>>();

  useEffect(() => {
    if (settingsQuery.data) {
      reset({
        combined: settingsQuery.data.combined,
        courseId: settingsQuery.data.courseId,
        defaultUILanguage: settingsQuery.data.defaultUILanguage,
        expireTime: settingsQuery.data.expireTime.toString(),
        language: settingsQuery.data.language,
        name: settingsQuery.data.name,
        totalSizeLimitKb: settingsQuery.data.totalSizeLimitKb.toString(),
      });
    }
  }, [reset, settingsQuery.data]);

  const onSubmit: SubmitHandler<Stringified<CourseDTO>> = (data) => {
    settingsMutation.mutate(
      {
        combined: data.combined,
        defaultUILanguage: data.defaultUILanguage,
        expireTime: +data.expireTime,
        language: data.language,
        name: data.name,
        totalSizeLimitKb: +data.totalSizeLimitKb,
      },
      {
        onSuccess: () => {
          toast.success(getTypedFormattedString(intl, "alert-settings-saved"));
          queryUtils.invalidateQueries(["settings.getCourseSettings"]);
          queryUtils.invalidateQueries(["session.getSessionInfo"]);
        },
        onError: () => {
          toast.error(getTypedFormattedString(intl, "alert-settings-save-failed"));
        },
      }
    );
  };

  return (
    <div>
      {/* Course settings */}

      <h3>
        <TypedFormattedMessage id="settings-title" />
      </h3>
      {settingsQuery.isLoading && <Spinner />}
      {settingsQuery.isError && <ErrorPanel />}
      {settingsQuery.data && !settingsQuery.isError && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Course name */}
          <div className="row mb-4">
            <label htmlFor="name" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="course-name" />
            </label>
            <div className="col-sm-6">
              <input
                type="text"
                className={clsx("form-control", { "is-invalid": errors.name })}
                id="name"
                {...register("name", { required: true, minLength: 1 })}
              />
            </div>
          </div>

          {/* Course id */}
          <div className="row mb-4">
            <label className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="course-id" />
            </label>
            <div className="col-sm-6">
              <input
                type="text"
                readOnly
                className="form-control-plaintext"
                defaultValue={settingsQuery.data.courseId}
              />
            </div>
          </div>

          {/* Combine with */}
          <div className="row mb-4">
            <label htmlFor="combined" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="combine-with" />
            </label>
            <div className="col-sm-6">
              <input type="text" className="form-control" id="combined" {...register("combined")} />
              <div className="form-text">
                <TypedFormattedMessage id="settings-connect-help" />
              </div>
            </div>
          </div>

          {/* Default UI language */}
          <div className="row mb-4">
            <label htmlFor="defaultLanguage" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="settings-default-language" />
            </label>
            <div className="col-sm-6">
              <select id="defaultLanguage" {...register("defaultUILanguage")}>
                <option value="fi">fi</option>
                <option value="en">en</option>
              </select>
              <div id="defaultLanguageHelp" className="form-text">
                <TypedFormattedMessage id="settings-default-language-help" />
              </div>
            </div>
          </div>

          {/* Programming language */}
          <div className="row mb-4">
            <label htmlFor="language" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="programming-language" />
            </label>
            <div className="col-sm-6">
              <input type="text" className="form-control" id="combined" {...register("language")} />
              <div className="form-text">
                <TypedFormattedMessage id="settings-programming-language-help" />
              </div>
            </div>
          </div>

          {/* Expiration time */}
          <div className="row mb-4">
            <label htmlFor="expireTime" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="expiration-time" />
            </label>
            <div className="col-sm-6">
              <input
                type="number"
                className={clsx("form-control", { "is-invalid": errors.expireTime })}
                id="expireTime"
                {...register("expireTime", { min: 1, max: 365 })}
              />
              <div className="form-text">
                <TypedFormattedMessage id="settings-expiration-help" />
              </div>
            </div>
          </div>

          {/* Total size quota */}
          <div className="row mb-4">
            <label htmlFor="totalSizeLimitKb" className="col-sm-2 col-form-label">
              <TypedFormattedMessage id="quota-size" />
            </label>
            <div className="col-sm-6">
              <input
                type="number"
                className={clsx("form-control", { "is-invalid": errors.totalSizeLimitKb })}
                id="totalSizeLimitKb"
                {...register("totalSizeLimitKb", { min: 1, max: 2048 })}
              />
              <div className="form-text">
                <TypedFormattedMessage id="settings-quota-size-help" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <TypedFormattedMessage id="save" />
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
