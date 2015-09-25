Rails.application.routes.draw do

  constraints subdomain: /api/ do
    mount_devise_token_auth_for 'User', at: 'auth'
    resources :nodes, only: [:create, :index, :update, :destroy]
    resources :organizations, only: [:create, :index, :update, :destroy]
    resources :chapters, only: [:create, :show, :index, :update, :destroy]
    resources :awsdocuments, only: [:create, :show, :update, :destroy] do
      member do
        put 'unarchive'
      end
    end
    resources :reports, only: [:update]

    get 'chapter/restrain_link', to: 'chapters#restrain_link'
    get 'awsdocument/restrain_link', to: 'awsdocuments#restrain_link'

    get 'organization/is_signed_up', to: 'organizations#is_signed_up?'
    get 'reports/firstchart', to: 'reports#first_chart'
    get 'reports/secondchart', to: 'reports#second_chart'
    get 'organization', to: 'organizations#show'
    get 'awsdocuments/archives', to: 'awsdocuments#archives'
    get 'report/nodes', to: 'reports#nodes'
    put 'activity', to: 'reports#update'

    post 'users/invite', to: 'users#invite'
    get 'user', to: 'users#show'
    get 'users', to: 'users#index'
    delete 'users', to: 'users#destroy'
    get 'connected', to: 'connexions#index'

    post 'users', to: 'organizationsuserslinks#create'

    get 'user/actions', to: 'actions#index_by_user'
    get 'organization/actions', to: 'actions#index_by_organization'
    get 'actions', to: 'actions#index'

    put 'users/connection', to: 'connexions#create'
    put 'users/news', to: 'users#update_news'
    
    get '/new_contact', to: 'application#new_contact'
    
  end

  root 'angular#index'

  get '/home', to: 'angular#index'
  get '/dashboard', to: 'angular#index'
  get '/account', to: 'angular#index'
  get '/superadmin', to: 'angular#index'
  get '/view', to: 'angular#index'
  get '/view/chapters/:id', to: 'angular#index'
  get '/view/documents/:id', to: 'angular#index'

  get '/mailer', to: 'mail#index'

  post '/user/invite', to: 'users#invite'
  get '/user/welcome', to: 'users#welcome'

  get '/translate', to: 'translations#index'
end
