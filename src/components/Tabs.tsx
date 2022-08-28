import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { SessionContext } from "./context/SessionContext";

type TabProps = {
  name: string;
  href: string;
};

const Tab: FC<TabProps> = (props) => {
  const router = useRouter();
  let cName = "nav-link";
  if (router.pathname === props.href) {
    cName += " active";
  }
  return (
    <li className="nav-item">
      <Link href={props.href}>
        <a className={cName}>
          <FormattedMessage id={props.name} />
        </a>
      </Link>
    </li>
  );
};

export const Tabs: FC = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext?.userName) {
    return null;
  }

  const tabs = [
    {
      href: "/",
      name: "tabs-my",
    },
    {
      href: "/items/create",
      name: "tabs-create",
    },
    {
      href: "/settings",
      name: "tabs-settings",
      role: "teacher",
    },
  ];

  return (
    <div className="mb-4">
      <ul className="nav nav-tabs">
        {tabs.map((tab) => {
          if (tab.role && sessionContext.role !== tab.role) {
            return null;
          } else {
            return <Tab key={tab.name} name={tab.name} href={tab.href} />;
          }
        })}
      </ul>
    </div>
  );
};
