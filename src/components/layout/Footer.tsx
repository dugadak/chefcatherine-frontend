import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ChefCatherine</h3>
            <p className="text-gray-300 text-sm">
              AI 기반 맞춤형 레시피 추천 서비스로 건강하고 맛있는 식생활을 도와드립니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/recipes" className="text-gray-300 hover:text-white text-sm">
                  레시피 둘러보기
                </Link>
              </li>
              <li>
                <Link to="/survey" className="text-gray-300 hover:text-white text-sm">
                  맞춤 추천 받기
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">레시피 카테고리</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">한식</li>
              <li className="text-gray-300 text-sm">중식</li>
              <li className="text-gray-300 text-sm">일식</li>
              <li className="text-gray-300 text-sm">양식</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">문의</h4>
            <p className="text-gray-300 text-sm">
              이메일: contact@chefcatherine.com
            </p>
            <p className="text-gray-300 text-sm">
              전화: 02-1234-5678
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 ChefCatherine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;