class Organization < ActiveRecord::Base
  
  before_save :format_subdomain
  
  has_many :nodes, dependent: :delete_all
  has_many :users
  has_many :awsdocuments
  has_many :connexions
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  validates_exclusion_of :subdomain, :in => ["api", "www", "sandbox"]
  
  def format_subdomain
    if self.website.include? 'www'
      self.subdomain = self.website.split('/')[2].split('.')[1]
    else
      self.subdomain = self.website.split('/')[2].split('.')[0]
    end
  end
  
end