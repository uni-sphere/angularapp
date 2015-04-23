Rails.application.routes.draw do
  
  constraints subdomain: 'api' do
    
    resources :users, only: [:show, :password_forgoten, :update]
    resources :nodes, only: [:create, :index, :update, :destroy]
    resources :organizations, only: [:create, :index, :update, :destroy]
    resources :chapters, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :update, :destroy] do
      member do
        put 'unarchive'
      end
    end
    
    get 'organization', to: 'organizations#show'
    get 'awsdocuments/archives', to: 'awsdocuments#archives'
    put 'activity', to: 'reports#update'
    post 'users/invite', to: 'users#invite'
    post 'users/login', to: 'users#login'
    post 'users/password_forgoten', to: 'users#password_forgoten'
    
  end

  root 'angular#index'

  get '/home', to: 'angular#index'
  
end
