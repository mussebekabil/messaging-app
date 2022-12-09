# Runbook

## API Endpoints

`GET /api/messages`

Return list of messages 

`GET /api/messages/{messageId}`

Return list of messages identified by `messageId`

`GET /api/users`

Return list of users

`GET /api/replies/{messageId}`

Return list of replies for the related message identified by `messageId`

`POST /api/users`

Request payload

 ```json
  { 
    "userId" : string 
  }
 ```

Create a new user per `userId` passed in the request body

`POST /api/messages`

Request payload

```json
  {
    "authorId" : string,
    "content": string 
  }
 ```

Send message. This endpoint publish the submitted message to the queue. The queue is consumed and sent to the `messaging-service` asynchronously. This api will respond `success` if it manages to enqueue the message to `rabbitmq` service

`POST /api/replies`

Request payload

```json
  {
    "authorId" : string,
    "messageId" : string,
    "content": string 
  }
 ```

Send reply to a message identified by `messageId`. This endpoint publish the submitted reply to the queue. The queue is consumed and sent to the `messaging-service` asynchronously. This api will respond `success` if it manages to enqueue the reply to `rabbitmq` service

`PATCH /api/messages`

Request payload

```json
  {
    "messageId" : string,
    "vote": number 
  }
 ```

Update message vote identified by `messageId`. The same as the corresponding `POST` request, it will be published to the queue.

`PATCH /api/replies`

Request payload

```json
  {
    "replyId" : string,
    "vote": number 
  }
 ```

Update reply vote identified by `replyId`. The same as the corresponding `POST` request, it will be published to the queue.

## Running k6-scripts

First, install `k6` script if it's not yet installed in your machine. Installation guide can be found [here](https://k6.io/docs/get-started/installation/).

We have *five* k6 test scripts under `k6-scripts` folder. Run the tests in such order so messages and replies are created first.

- `api-create-message.js` - For API endpoint used for creating new post
- `api-create-reply.js` - For API endpoint used for creating new message reply
- `api-get-all-messages.js` - For API endpoint used for getting list of messages
- `single-message-page.js` - For single message page performance test
- `main-page.js` - For main page performance test

For example, run the scripts as follows

```console
k6 run k6-scripts/api-create-message.js  
```

You can run the following command to follow the autoscaling while the test is running.

```console
kubectl get hpa -w 
```

## Steps for kubernetes deploy

1. Start minikube and add required add-ons. Then start minikube tunnel 

```console
minikube start 
```

```console
minikube addons enable ingress
```

```console
minikube addons enable metrics-server
```

```console
sudo minikube tunnel
```

2. Once everything is up and running, if you want to use the dashboard, run the following command

```console
minikube dashboard
```

3. Run the following commands to deploy rabbitmq


```console
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```

```console
kubectl apply -f kubernetes/rabbitmq-cluster.yaml
```

4. (Optional) if you want to use rabbitmq management ui, expose using the following `port-forwarding` command

```console
kubectl -n default port-forward rabbitmqcluster-server-0 15672:15672
```

5. Deploy CloudeNativePG and database migration

```console
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.18/releases/cnpg-1.18.0.yaml
```

```console
kubectl apply -f kubernetes/database-config.yaml
```

Wait a while until the database cluster and secrets created. Or at least check if secrets are created 

```console
kubectl get secrets database-cluster-app
```

```console
minikube image build -t flyway ./flyway
```

```console
kubectl apply -f kubernetes/database-migration-job.yaml
```

6. Build and deploy websocket

```console
minikube image build -t ws-messaging ws-messaging-service
```

```console
kubectl apply -f kubernetes/ws-messaging.yaml,kubernetes/ws-messaging-service.yaml
```

6. Build and deploy api and related api-autoscaling. First, deploy the metric-server.


```console
kubectl apply -f kubernetes/components.yaml
```

```console
minikube image build -t api ./api 
```

```console
kubectl apply -f kubernetes/api.yaml,kubernetes/api-service.yaml
```

```console
kubectl apply -f kubernetes/api-autoscaling.yaml
```

7. Similarly build and deploy the messaging service and related messaging-autoscaling.


```console
minikube image build -t messaging ./messaging-service 
```

```console
kubectl apply -f kubernetes/messaging.yaml,kubernetes/messaging-service.yaml
```

```console
kubectl apply -f kubernetes/messaging-autoscaling.yaml
```

8. Build and deploy UI app


```console
minikube image build -t ui ./ui
```

```console
kubectl apply -f kubernetes/ui.yaml,kubernetes/ui-service.yaml
```

9. Deploy ingress

```console
kubectl apply -f kubernetes/nginx-ingress.yaml 
```
