Rails.application.routes.draw do
  
  constraints subdomain: 'api' do
    
    resources :users, only: [:show, :password_forgoten, :update]
    resources :nodes, only: [:create, :show, :index, :update, :destroy]
    resources :organizations, only: [:create, :show, :index, :update, :destroy]
    resources :chapters, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :index, :update, :destroy] do
      member do
        put 'unarchive'
      end
    end
    
    get 'awsdocuments/archives', to: 'awsdocuments#archives'
    
  end

  root 'angular#index'

  get '/home', to: 'angular#index'

end
