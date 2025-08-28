import styled from "styled-components";
import Logo from "../Logo";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";

const DashboardNavbar = () => {
    const { showSidebar, setShowSidebar } = useDashboardContext();

    return (
        <Wrapper>
            <div className="nav-container">
                <div className="start">
                    <button
                        className="toggler"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <ion-icon name="menu"></ion-icon>
                    </button>
                </div>
                <div className="center">
                    <Logo />
                </div>
                <div className="end">
                    <Link to="/dashboard/notifications" className="notification-icon">
                        <FiBell className="icon" />
                        <span className="notification-dot"></span>
                    </Link>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.nav`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    padding: 0.7rem 1rem;
    background-color: var(--color-white);
    z-index: 99;

    .nav-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .start .toggler {
        font-weight: 900;
        font-size: 24px;
        color: var(--color-primary);
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.14);
        padding: 4px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .start .toggler:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-grey-700);
        font-size: 1.5rem;
        position: relative;
        transition: all 0.3s ease;
    }

    .notification-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background-color: #FF3B30;
        border-radius: 50%;
        border: 1px solid white;
    }

    .badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: var(--color-danger);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-weight: bold;
    }

    @media (max-width: 600px) {
        padding: 0.5rem 0.8rem;

        .start .toggler {
            font-size: 20px;
            padding: 3px 5px;
        }

        .notification-icon {
            font-size: 1.3rem;
        }

        .center {
            max-width: 100px;
        }
    }

    @media (min-width: 992px) {
        position: sticky;
        top: 0;
    }
`;

export default DashboardNavbar;
