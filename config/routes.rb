Rails.application.routes.draw do

  constraints subdomain: 'api' do
    mount_devise_token_auth_for 'User', at: 'auth'
    # devise_for :users
    resources :nodes, only: [:create, :index, :update, :destroy]
    resources :organizations, only: [:create, :index, :update, :destroy]
    resources :chapters, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :update, :destroy] do
      member do
        put 'unarchive'
      end
    end
    resources :reports, only: [:update]
    
    get 'organization/is_signed_up', to: 'organizations#is_signed_up?'
    get 'reports/firstchart', to: 'reports#first_chart'
    get 'reports/secondchart', to: 'reports#second_chart'
    get 'organization', to: 'organizations#show'
    get 'awsdocuments/archives', to: 'awsdocuments#archives'
    get 'report/nodes', to: 'reports#nodes'
    put 'activity', to: 'reports#update'
    
    # put 'user', to: 'users#update'
    # post 'users/invite', to: 'users#invite'
    # post 'users/login', to: 'users#login'
    # post 'users/password_forgoten', to: 'users#password_forgoten'
    
  end

  root 'angular#index'

  get '/home', to: 'angular#index'
  get '/dashboard', to: 'angular#index'
  get '/account', to: 'angular#index'
  
end
