Rails.application.routes.draw do
  
  
  constraints subdomain: 'api' do
    
    resources :users, only: [:show, :password_forgoten, :update]
    resources :nodes, only: [:create, :show, :index, :update, :destroy]
    resources :organizations, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :index, :update, :destroy] do
      member do
        get 'download'
        put 'unarchive'
      end
    end
    
    get 'awsdocuments/archives', to: 'awsdocuments#archives'
    
  end

  root 'angular#index'

  # get "*path.html", to: "angular#index", layout: 0
  # get "*path", to: "angular#index"

  get "/api/documents", to: "angular#documents"
  get "/api/nodes", to: "angular#nodes"
  get "/api/cookiesNode", to: "angular#cookies"

  post "/api/nodes/create", to: "angular#create" 

end
