namespace :newsfeed do
  desc "set news to true"
  task initial: :environment do
    User.all.each do |user|
      user.news = true
      user.save
    end
  end

end
