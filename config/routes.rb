Rails.application.routes.draw do
  root 'angular#index'

  # get "*path.html", to: "angular#index", layout: 0
  # get "*path", to: "angular#index"

  get "/api/chapters", to: "angular#show"
  get "/api/nodes", to: "angular#nodes"
  get "/api/cookiesNode", to: "angular#cookies"

  post "/api/nodes/create", to: "angular#create" 

end
