Rails.application.routes.draw do
  
  
  constraints subdomain: 'api' do
    
    # users
    
    post '/users', to: 'users#create'
    get '/user', to: 'users#show'
    get '/users', to: 'users#index'
    put '/users', to: 'users#update'
    delete '/users', to: 'users#destroy'
    
    # nodes
    
    post '/nodes', to: 'nodes#create'
    get '/node', to: 'nodes#show'
    get '/nodes', to: 'nodes#index'
    put '/nodes', to: 'nodes#update'
    delete '/nodes', to: 'nodes#destroy'
    
    # awsdocuments
    
    post '/awsdocuments', to: 'awsdocuments#create', as: 'create_document'
    get '/awsdocument', to: 'awsdocuments#show'
    get '/awsdocuments', to: 'awsdocuments#index'
    get '/awsdocuments/archive', to: 'awsdocuments#archive'
    put '/awsdocuments', to: 'awsdocuments#update'
    delete '/awsdocuments', to: 'awsdocuments#destroy'
    
    # organizations
    
    post '/organizations', to: 'organizations#create'
    get '/organization', to: 'organizations#show'
    get '/organizations', to: 'organizations#index'
    put '/organizations', to: 'organizations#update'
    delete '/organizations', to: 'organizations#destroy'
    
  end

  root 'angular#index'

  get "*path.html", to: "angular#index", layout: 0
  get "*path", to: "angular#index"

  get "/api/chapters", to: "angular#show"

end
