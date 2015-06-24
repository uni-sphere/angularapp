class Connexion < ActiveRecord::Base
  
  after_create :increase_count
  belongs_to :organization
  
  def increase_count
    update_attributes(count: count + 1)
  end

end
