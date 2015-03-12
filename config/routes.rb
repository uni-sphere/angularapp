Rails.application.routes.draw do
  
  
  constraints subdomain: 'api' do
    
    resources :users, only: [:create, :show, :index, :update, :destroy]
    resources :nodes, only: [:create, :show, :index, :update, :destroy]
    resources :organizations, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :index, :update, :destroy] do
      member do
        put 'archive'
      end
    end
    
  end

  root 'angular#index'

  # get "*path.html", to: "angular#index", layout: 0
  # get "*path", to: "angular#index"

  get "/api/chapters", to: "angular#show"

end
