import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./CartToSelect.module.css";

function DashBoardRegister() {
  const location = useLocation();

  const isCompany =
    location.pathname.includes("/login/superadmin") ||
    location.pathname === "/login";
  const isCandidate = location.pathname.includes("/login/recuriter");

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4">
      <div className={styles.container}>
        <h2 className={styles.title}>Choose Your Path</h2>

        <div className={styles.cardContainer}>
          <Link to="/login/superadmin">
            <div
              className={`${styles.card} ${isCompany ? styles.activeCard : ""}`}
            >
              <h3 className={styles.cardTitle}>Super Admin</h3>
              <p className={`styles.cardDescription hidden sm:flex`}>
                Register as an Super Admin to manage your company and its
                employees
              </p>
            </div>
          </Link>

          <Link to="/login/recuriter">
            <div
              className={`${styles.card} ${
                isCandidate ? styles.activeCard : ""
              }`}
            >
              <h3 className={styles.cardTitle}>Recuriter</h3>
              <p className={`styles.cardDescription hidden sm:flex`}>
                Register as a Recuriter to manage your candidates and job
                postings
              </p>
            </div>
          </Link>
        </div>

        <div className={styles.outletContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashBoardRegister;
