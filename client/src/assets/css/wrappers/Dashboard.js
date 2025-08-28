import styled from "styled-components";

const Wrapper = styled.section`
    .dashboard {
        display: grid;
        grid-template-columns: auto 1fr;
    }
    .dashboard-page {
        width: 100%;
        margin-bottom: 60px;
    }

    @media (max-width: 992px) {
        .dashboard {
            grid-template-columns: 1fr;
        }
    }
`;

export default Wrapper;
