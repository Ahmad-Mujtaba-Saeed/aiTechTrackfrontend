import React from "react";
import "./Feedback.css";
import FeedbackGraph from "./FeedbackGraph";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const FeedbackComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { parsedFeedback } = useSelector((state) => state.interview);
  const { data } = useSelector((state) => state.interview);
  return (
    <>
      <FeedbackGraph parsedFeedback={parsedFeedback} />

      <div className="row mt-2 g-2 mb-4">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-header py-3">
              <div
                className="icon-item icon-item-md rounded-1 d-inline-block px-2 py-2 me-2"
                style={{ backgroundColor: '#ece5fc' }}>
                <svg className="svg-inline--fa fa-code-compare fs-7" style={{ color: '#ba67ef' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code-compare" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M320 488c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1s14.2 12.4 14.2 21.9l0 40 16 0c35.3 0 64-28.7 64-64l0-166.7C371.7 141 352 112.8 352 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3L464 320c0 70.7-57.3 128-128 128l-16 0 0 40zM456 80a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM192 24c0-9.5 5.6-18.1 14.2-21.9s18.8-2.3 25.8 4.1l80 72c5.1 4.6 7.9 11 7.9 17.8s-2.9 13.3-7.9 17.8l-80 72c-7 6.3-17.2 7.9-25.8 4.1s-14.2-12.4-14.2-21.9l0-40-16 0c-35.3 0-64 28.7-64 64l0 166.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3L48 192c0-70.7 57.3-128 128-128l16 0 0-40zM56 432a24 24 0 1 0 48 0 24 24 0 1 0 -48 0z"></path></svg>
              </div>
              <span className="h5"> Core Feedback</span>
            </div>
            <div className="card-body p-4">
              <div className="feedback-checklist p-0">


                {/* {parsedFeedback?.evaluation?.top_improvements?.map((issue, index) => (
                                <li key={index}>
                                    <strong>{issue.title}</strong><br />
                                    {issue.description}
                                </li> */}

                {parsedFeedback?.evaluation?.top_improvements?.map((issue, index) => (
                  <div className="item d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0">
                      {/* <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg> */}
                      <svg xmlns="http://www.w3.org/2000/svg" width={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right  text-success"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                    </div>
                    <div>
                      <h5 className="mb-1">{issue.title}</h5>
                      <p>
                        {issue.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="mb-1">Define Your Task</h5>
                    <p>Clearly state what your responsibilities were in that situation.</p>
                  </div>
                </div>

                <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="mb-1">Detail Your Actions</h5>
                    <p>Explain the specific actions you took to address the pressure.</p>
                  </div>
                </div>


                <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="text-success mb-1">Share Measurable Results</h5>
                    <p>
                      Conclude with the outcomes of your actions, including reflections on
                      what you learned.
                    </p>
                  </div>
                </div>

                <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="mb-1">Provide a Clear Situation</h5>
                    <p>
                      Describe a specific time and context where you had to perform under
                      pressure.
                    </p>
                  </div>
                </div>


                <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="mb-1">Define Your Task</h5>
                    <p>Clearly state what your responsibilities were in that situation.</p>
                  </div>
                </div>


                <div className="item d-flex align-items-start gap-3">
                  <div className="icon flex-shrink-0">
                    <svg className="svg-inline--fa fa-check text-success" width={12} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  </div>
                  <div>
                    <h5 className="mb-1">Detail Your Actions</h5>
                    <p>Explain the specific actions you took to address the pressure.</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-header py-3">
              <div
                className="icon-item icon-item-md rounded-1 d-inline-block px-2 py-2 me-2"
                style={{ backgroundColor: '#ece5fc' }}>
                <svg className="svg-inline--fa fa-comments fs-7" style={{ color: '#ba67ef' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comments" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"></path></svg>
              </div>
              <span className="h5"> Interview Transcript</span>
            </div>
            <div className="card-body p-5">

              <section className="chat-transcript py-0">

                <div className="chat-row">
                  <div className="meta">Question asked by <strong>MyPathfinder</strong></div>
                  <div className="bubble bubble--mpf">
                    {parsedFeedback?.question?.speech ?? "NAN"}
                  </div>
                </div>

                <div className="chat-row right">
                  <div className="meta">Your response</div>
                  <div className="bubble bubble--user">
                    {parsedFeedback?.transcription ?? "NAN"}
                  </div>
                </div>


                <div className="chat-row">
                  <div className="meta"><strong>MyPathfinder</strong> suggested response structure</div>
                  <div className="bubble bubble--ideal">
                    {parsedFeedback?.evaluation?.ideal_response ?? "NAN"}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackComponent;
