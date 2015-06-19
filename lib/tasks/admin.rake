namespace :admin do
  desc "administrator actions"
  
  task delete_user:, :email, needs: [:email] do |t, args|
  end
  
  task delete_organization:, :subdomain, needs: [:subdomain] do |t, args|   
  end
  
  task create_organization:, :subdomain, needs: [:subdomain] do |t, args| 
  end
  
  task create_user:, :id, needs: [:id] do |t, args| 
  end
  
  task read_user:, :email, needs: [:email] do |t, args| 
  end
  
  task read_organization:, :subdomain, needs: [:subdomain] do |t, args| 
  end
  
end
