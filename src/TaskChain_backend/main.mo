import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor {
  public type TaskStatus = {
    #Pending;
    #Ongoing;
    #Cancelled;
    #Completed;
  };

  public type TaskPayload = {
    name : Text;
    description : Text;
    status : TaskStatus;
  };

  public type Task = TaskPayload and {
    id : Nat;
  };

  let { nhash; phash } = Map;
  // Counter for auto-incrementing task IDs
  stable var taskIdCounter : Nat = 0;

  // Map to store tasks by ID
  stable let tasks = Map.new<Nat, Task>();

  // Function to generate a new unique task ID
  func generateTaskId() : Nat {
    taskIdCounter += 1;
    return taskIdCounter;
  };

  // Function to create a new task
  public func createTask(name : Text, description : Text, status : TaskStatus) : async Task {
    let taskId = generateTaskId();
    let newTask : Task = {
      id = taskId;
      name;
      description;
      status;
    };
    Map.set(tasks, nhash, taskId, newTask);
    return newTask;
  };

  // Function to retrieve tasks
  public query func getTasks() : async [Task] {
    return Iter.toArray<Task>(Map.vals(tasks));
  };

  func getTask(taskId : Nat) : Task {
    switch (Map.get(tasks, nhash, taskId)) {
      case null { Debug.trap("task not found") };
      case (?t) { t };
    };
  };

  // Function to retrieve a task by ID
  public query func getTaskById(taskId : Nat) : async Task {
    return getTask(taskId);
  };

  // Function to update a task
  public func updateTask(taskId : Nat, payload : TaskPayload) : async () {
    let task = getTask(taskId);

    Map.set(
      tasks,
      nhash,
      taskId,
      {
        task with name = payload.name;
        description = payload.description;
        status = payload.status;
      },
    );
  };

  // Function to delete a task by ID
  public func deleteTask(taskId : Nat) : async () {
    let _ = Map.remove(tasks, nhash, taskId);
  };
};
