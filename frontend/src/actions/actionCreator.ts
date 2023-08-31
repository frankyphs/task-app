import { FETCH_TASKS, FETCH_FORM, FETCH_TEMPLATE } from "./actionType";

export const getTasks = (payload) => ({
  type: FETCH_TASKS,
  payload,
});

export const getTemplates = (payload)=>({
  type: FETCH_TEMPLATE,
  payload,
})

const baseUrl = "http://localhost:3000";

export const fetchTasks =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    try {
      const response = await fetch(
        `${baseUrl}/tasks?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw { name: "error" };
      }
      const jsonData = await response.json();

      dispatch(getTasks(jsonData));
    } catch (err) {
      console.log(err);
    }
  };

  export const fetchTemplate =()=> async (dispatch)=>{
    try {
      const response = await fetch(
        `${baseUrl}/templates`
      )
      if (!response.ok) {
        throw { name: "error" };
      }
      const jsonData = await response.json()
      dispatch(getTemplates(jsonData))
    } catch (err) {
      console.log(err)
    }
  } 

export const deleteTasks = (id:number) => async (dispatch : any) => {
  try {
    const opt = {
      method: "delete",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const response = await fetch(`${baseUrl}/tasks/${id}`, opt);
    if (!response.ok) {
      throw { name: "error" };
    }

    dispatch(fetchTasks());
  } catch (error) {
    console.log(error);
  }
};

export const addTask = (payload:string) => async (dispatch) => {
  try {
    const opt = {
      method: "post",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(`${baseUrl}/tasks`, opt);
    if (!response.ok) {
      throw { name: "error", data: await response.json() };
    }

    dispatch(fetchTasks());
  } catch (err) {
    console.log(err);
  }
};

export const saveTemplate = (payload) => async (dispatch) => {
  try {
    
    const opt = {
      method: "post",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(`${baseUrl}/templates`, opt);
    if (!response.ok) {
      throw { name: "error", data: await response.json() };
    }

    dispatch(fetchTemplate());
  } catch (err) {
    console.log(err);
  }
};


export const editTask = (id:number, payload) => async (dispatch) => {
  try {
    const opt = {
      method: "put",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(`${baseUrl}/tasks/${id}`, opt);
    if (!response.ok) {
      throw { name: "error", data: await response.json() };
    }

    dispatch(fetchTasks());
  } catch (err) {
    console.log(err);
  }
};


// export const saveTemplate = (payload) => ({
//   type: FETCH_FORM,
//   payload,
// });
