Rails.application.routes.draw do
  root 'angular#index'

  get "*path.html" => "angular#index", :layout => 0
  get "*path" => "angular#index"
end
