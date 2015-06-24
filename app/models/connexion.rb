class Connexion < ActiveRecord::Base
  
  after_create :increase_count
  belongs_to :organization
  
  def activity
    if updated_at - DateTime.now > 30.minutes
      update_attributes(count: count + 1)
    else
      update_attributes(updated_at: DateTime.now)
    end 
  end

end
