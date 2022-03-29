package com.yishua.hbxxl.http;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Random;

import javax.crypto.Cipher;

public class RsaPhone {

	private static String privatekey = "30820277020100300D06092A864886F70D0101010500048202613082025D02010002818100B707C99D15184695C1BF2DFF12FD6EDD7A10F19EEA6F0EE6965ECD229C55F188CF977F0B2D0F6E41152788884D060ED3E69564981CCABCD79207319E394277E696FD8953BD849795039EE01E50821B08E15D02157F535BBC8B7F76D5384374B2534A59AB321037603149CBDB6A8C5C50D2D61BB840427246E6E53F161095774102030100010281806F9E792EA9B1AF421EF0D73D2A389206D12D4A1CCEFD418A1003EA7803FD499A5477204C1183CA8A383B6EC128AFDC151016E54CFAAA0CF62E20E2FA8A12E6091738DEAEBB0EA47221AF557987CFEA38DFA562D8A24F94538DF1672210CDE2214605A3B8EACD05AC44BCEC2CF8F3EF411E9AC2E60A9B65BDC87E2C593E5D6CAD024100FF9D5407AF0A93E871D7D653874C0D9F9303CA6D4580FA979829577024B8FF58E2AA9AB9AA1F74C9D493103B28997378409FFD4EBBBD8937C25DDE09BEFF3163024100B74E70C774BDB21DF7BF23B71680380D7CB5527EC1CDFB3A9FD174B5D0BA47DA04C5BB18C4354B2A559BEF0AB9B5851D880577AA28134745F86DC0A839A3C80B024100B4B38A05EC8E73C56D458234867F135A6DD9CE2EB565DAC17446359407C1E871F3BB5BAA4943F791FEFF0008724918C2381D623B58A942E9F233DD95D23A21B502403E0A4167705E87BB56CF8D61F92E9A4A0E4C3C48848597A306D6585EF4EF274465DB1A70CE6F8F2A1BE173ED385F745743633E560BCC42922EFBCE79E1504A7302410084FD2F25F03B2D0E00B385EFFEA307127498428B6B2377507920E70AE9BBA47382DEF72EC01BB43063056799E1FC534D778FA600A918F895FD44DA690B816F4B";


	public static void main(String[] args) throws Exception {

		String a = jiami("123456");
		System.out.println(a);

	}

	/**
	 *
	 * @param timestamp
	 *            13位时间戳
	 * @param userid
	 *            用户的userid，未登录或其他异常传0
	 * @return
	 * @throws Exception
	 */
	public static String getToken(String timestamp, String userid) {

		try {
			String nonce = String.valueOf(Math.abs(new Random().nextInt()));

			if(null == userid || "".equals(userid)) {
				userid = "0";
			}

			String src = timestamp + "," + userid + "," + nonce;

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
			// 【加密】
			PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(parseHexStr2Byte(privatekey));
			PrivateKey privateKey = keyFactory.generatePrivate(pkcs8EncodedKeySpec);
			cipher.init(Cipher.ENCRYPT_MODE, privateKey);
			byte[] result = cipher.doFinal(src.getBytes());
			return parseByte2HexStr(result);
		} catch (Exception e) {
			e.printStackTrace();
			return userid;
		}

	}

	public static String jiami(String src) {

		try {

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
			// 【加密】
			PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(parseHexStr2Byte(privatekey));
			PrivateKey privateKey = keyFactory.generatePrivate(pkcs8EncodedKeySpec);
			cipher.init(Cipher.ENCRYPT_MODE, privateKey);
			byte[] result = cipher.doFinal(src.getBytes());
			return parseByte2HexStr(result);
		} catch (Exception e) {
			e.printStackTrace();
			return src;
		}

	}

	/**
	 * 生成密钥对
	 *
	 * @throws Exception
	 */
	private static void creatmiyao() throws Exception {
		// 1.初始化密钥
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
		keyPairGenerator.initialize(1024);// 密钥长度为64的整数倍，最大是65536
		KeyPair keyPair = keyPairGenerator.generateKeyPair();
		RSAPublicKey rsaPublicKey = (RSAPublicKey) keyPair.getPublic();
		RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) keyPair.getPrivate();
		byte[] pk = rsaPublicKey.getEncoded();
		byte[] sk = rsaPrivateKey.getEncoded();
		System.out.println("RSA公钥：" + parseByte2HexStr(pk));
		System.out.println("RSA私钥：" + parseByte2HexStr(sk));// 可以将其保存到本地文件中
	}

	/**
	 * 二进制转换成16进制，加密后的字节数组不能直接转换为字符串
	 */
	static String parseByte2HexStr(byte buf[]) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < buf.length; i++) {
			String hex = Integer.toHexString(buf[i] & 0xFF);
			if (hex.length() == 1) {
				hex = '0' + hex;
			}
			sb.append(hex.toUpperCase());
		}
		return sb.toString();
	}

	/**
	 * 16进制转换成二进制
	 */
	static byte[] parseHexStr2Byte(String hexStr) {
		if (hexStr.length() < 1)
			return null;
		byte[] result = new byte[hexStr.length() / 2];
		for (int i = 0; i < hexStr.length() / 2; i++) {
			int high = Integer.parseInt(hexStr.substring(i * 2, i * 2 + 1), 16);
			int low = Integer.parseInt(hexStr.substring(i * 2 + 1, i * 2 + 2), 16);
			result[i] = (byte) (high * 16 + low);
		}
		return result;
	}

}
