# Activity 08.c: HTTP Requests and Responses

In this activity you will explore the basics of HTTP requests and responses, and how to use the Insomnia HTTP client to test and interact with an HTTP server. 


## Resources:

1. [HTTP Request Methods on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
2. [Insomnia](https://insomnia.rest/download)
3. [httpbin.org](https://httpbin.org/)

## Task 1: Setting Up Insomnia

This task will have you install Insomnia and get it set up to make HTTP requests.

### Steps

1. Download and install [Insomnia](https://insomnia.rest/download).
2. Launch the Insomnia application on your computer.
3. Select the option to use the local Scratch Pad. There is no need to sign in.
4. Click the button to create a new request 

## Task 2: Sending a GET Request

In this task you will send a GET request to https://httpbin.org/get and analyze the response.

### Steps

1. Right-click on the new request created in the previous step and rename it to "My GET Request".
2. Set the request type to GET.
3. Enter the URL: `https://httpbin.org/get`.
4. Click the "Send" button to send the request. You should see the response in the right pane.
5. In the middle pane, add new query parameters to the URL (e.g., `?name=John&age=30`) and send the request again.
6. Observe how the query parameters are reflected in the response.

## Task 3: Sending a POST Request

In this task you will send a POST request to https://httpbin.org/post with a body.

### Steps

1. Create a new request and rename it to "My POST Request".
2. Set the request type to POST.
3. Enter the URL: `https://httpbin.org/post`.
4. Switch to the "Body" tab in the middle pane.
5. Select "plain text" and enter some text in the body.
6. Click the "Send" button to send the request. You should see a response with the data you sent in the body.
7. Now add new query parameters to the URL and send the request again.
8. Observe how the query parameters are reflected in the response. You can send data in the body and as query parameters at the same time.

## Task 4: Exploring Other HTTP Methods

In this task you will explore other HTTP methods (PUT and DELETE) using Insomnia.

### Steps

1. Create a new request and rename it to "My PUT/DELETE Request".
2. Change the request type to PUT or DELETE.
3. Enter the URL: `https://httpbin.org/put` or `https://httpbin.org/delete`, depending on the operation you want to perform.
4. Send the request and analyze the response.
5. Change the request type, body, query parameters, headers, etc. and send requests with different configurations to observe the responses.
