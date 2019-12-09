import React from "react";

class ViewGoal extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h2>Goal Title</h2>
        </div>

        <div>
          <button>Add Task</button>
          <button>Edit Goal</button>
          <select>
            <option>Status</option>
            <option>Not started</option>
            <option>In progress</option>
            <option>On hold</option>
            <option>Complete</option>
          </select>
          <button>Delete</button>
        </div>

        <div>
          <h3>Why I want to do it</h3>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>

          <h3>Descriptions</h3>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div>
          <h3>Daily Tasks</h3>
        </div>
      </div>
    );
  }
}

export default ViewGoal;