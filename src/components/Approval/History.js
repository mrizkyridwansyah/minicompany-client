import React, { useState, useRef, useEffect } from "react";
import { ListGroup, Badge, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRoot } from "../../RootContext";

export default function History({ activityId }) {
  const [approvals, setApprovals] = useState([]);
  const { fetchQuery, logout } = useRoot();
  const history = useHistory();

  function getApprovals() {
    const query = {
      query: `query {
                approvals (activityId: "${activityId}") {
                  id,
                  userId,
                  level,
                  approvedFlag,
                  approvedDate,
                  notes
                  }
              }`,
    };

    fetchQuery(
      process.env.REACT_APP_HRIS_URI_GRAPHQL,
      query,
      true,
      "POST"
    ).then(async (result) => {
      console.log(result);
      if (result.status !== 200) {
        if (result.status === 403) {
          await logout();
          history.push("/login");
        }
      } else {
        setApprovals(
          result.body.data.approvals.filter(
            (approval) => approval.approvalDate !== null
          )
        );
      }
    });
  }

  useEffect(() => {
    getApprovals();
  }, []);

  return (
    <>
      {/* <hr /> */}
      <Card style={{ width: "40em" }} className="mb-3">
        <ListGroup variant="flush">
          {approvals.length > 0 &&
            approvals.map((approval) => {
              return (
                <>
                  {approval.approvedDate && (
                    <ListGroup.Item>
                      <b>Level {approval.level}</b> {approval.approvedDate}{" "}
                      <br /> {approval.notes}
                      <Badge
                        variant={approval.approvedFlag ? "success" : "danger"}
                        style={{ float: "right" }}
                        data-id={approval.id}
                      >
                        {approval.approvedFlag ? "Approved" : "Rejected"}
                      </Badge>
                    </ListGroup.Item>
                  )}
                </>
              );
            })}
        </ListGroup>
      </Card>
    </>
  );
}
